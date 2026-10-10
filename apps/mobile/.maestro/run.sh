#!/usr/bin/env bash
# Visual regression test: screenshots the app on the iOS simulator and compares
# each one with its reference image in screenshots/.
#
#   run.sh            compare with the references
#   run.sh --update   replace the references with how the app looks now
#
# Needs Maestro, the simulator named below booted with Expo Go installed, and
# the app's dev server running (npm run mobile).
set -euo pipefail

cd "$(dirname "$0")"

# The references were taken on this simulator. Another model has a different
# screen, so every comparison would fail.
device='iPhone 16e'
expo_go='host.exp.Exponent'
dev_server='127.0.0.1:8081'

update=false
if [[ "${1:-}" == '--update' ]]; then
  update=true
fi

fail() {
  echo "visual test: $1" >&2
  exit 1
}

command -v maestro >/dev/null || fail 'Maestro is not installed. See the README.'
# Homebrew does not put its Java on the PATH, and Maestro needs one.
if [[ -z "${JAVA_HOME:-}" ]] && command -v brew >/dev/null; then
  jdk="$(brew --prefix openjdk 2>/dev/null)/libexec/openjdk.jdk/Contents/Home"
  if [[ -x "$jdk/bin/java" ]]; then
    export JAVA_HOME="$jdk"
  fi
fi

udid="$(xcrun simctl list devices booted | sed -n "s/^ *$device (\([0-9A-F-]*\)) (Booted).*/\1/p" | head -1)"
[[ -n "$udid" ]] || fail "boot the $device simulator first."
curl -sf -o /dev/null "http://$dev_server/status" || fail 'start the dev server first: npm run mobile'
container="$(xcrun simctl get_app_container "$udid" "$expo_go" data 2>/dev/null)" ||
  fail "open the app in Expo Go on the $device simulator once first."

# Three things would otherwise differ from run to run or from one machine to the
# next: the clock, the light or dark setting, and Expo Go's floating tools
# button. Each is fixed for the run and put back afterwards.
prefs="$container/Library/Preferences/$expo_go"
tools_button='EXDevMenuShowFloatingActionButton'
tools_button_before="$(xcrun simctl spawn "$udid" defaults read "$prefs" "$tools_button" 2>/dev/null || echo unset)"
appearance_before="$(xcrun simctl ui "$udid" appearance)"

restore() {
  xcrun simctl terminate "$udid" "$expo_go" 2>/dev/null || true
  xcrun simctl status_bar "$udid" clear || true
  xcrun simctl ui "$udid" appearance "$appearance_before" || true
  case "$tools_button_before" in
    unset) xcrun simctl spawn "$udid" defaults delete "$prefs" "$tools_button" || true ;;
    1) xcrun simctl spawn "$udid" defaults write "$prefs" "$tools_button" -bool YES || true ;;
    *) xcrun simctl spawn "$udid" defaults write "$prefs" "$tools_button" -bool NO || true ;;
  esac
  # Leave the app open again, as it was.
  xcrun simctl openurl "$udid" "exp://$dev_server" || true
}
trap restore EXIT

xcrun simctl terminate "$udid" "$expo_go" 2>/dev/null || true
xcrun simctl status_bar "$udid" override --time '9:41' --batteryState charged --batteryLevel 100 \
  --wifiBars 3 --cellularBars 4
xcrun simctl spawn "$udid" defaults write "$prefs" "$tools_button" -bool NO

output="$(mktemp -d)"
status=0
for scheme in light dark; do
  # Each run starts Expo Go afresh, so nothing is left over from the one before.
  xcrun simctl terminate "$udid" "$expo_go" 2>/dev/null || true
  xcrun simctl ui "$udid" appearance "$scheme"
  maestro --udid "$udid" test --test-output-dir "$output/$scheme" \
    -e APP_URL="exp://$dev_server" -e SCHEME="$scheme" -e UPDATE="$update" sign-in.yaml || status=1
done

if [[ "$update" == true && "$status" == 0 ]]; then
  find "$output" -path '*/takeScreenshot/*.png' -exec cp {} screenshots/ \;
  echo "visual test: references updated in $(pwd)/screenshots"
elif [[ "$status" != 0 ]]; then
  echo "visual test: failed. Each screenshot that differs has a _diff.png beside its reference in $(pwd)/screenshots" >&2
fi
exit "$status"
