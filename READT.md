cat <<EOF >~/Library/LaunchAgents/com.whyuenac.karabiner.plist
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>com.whyuenac.karabiner</string>
    <key>ProgramArguments</key>
    <array>
      <string>/etc/profiles/per-user/isaacyuen/bin/yarn</string>
      <string>run</string>
      <string>watch</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/karabiner_whyuenac.out.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/karabiner_whyuenac.err.log</string>
    <key>WorkingDirectory</key>
    <string>$HOME/Desktop/opensources/typescript-karabiner-config</string>
    <key>EnvironmentVariables</key>
    <dict>
      <key>PATH</key>
      <string>/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/etc/profiles/per-user/isaacyuen/bin</string>
    </dict>
  </dict>
</plist>
EOF