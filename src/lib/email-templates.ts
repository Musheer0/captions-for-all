export const sendSuccessfulVideoProcessedHtml = ({downloadUrl,userEmail,language}:{downloadUrl:string,userEmail:string,language:string})=>{
    return `
    <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Your Captioned Video is Ready</title>
  </head>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">
    
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="padding:20px;">
      <tr>
        <td align="center">
          
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
            
            <!-- Header -->
            <tr>
              <td style="background:#111827; color:#ffffff; padding:20px; text-align:center;">
                <h2 style="margin:0;">🎬 Your Video is Ready</h2>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px; color:#333333;">
                
                <p style="font-size:16px;">
                  Hey <strong>${userEmail}</strong>,
                </p>

                <p style="font-size:16px;">
                  Your video with <strong>${language}</strong> captions has been successfully processed and is ready to download.
                </p>

                <p style="font-size:16px;">
                  Click the button below to grab your video 👇
                </p>

                <!-- Button -->
                <table align="center" cellpadding="0" cellspacing="0" style="margin:20px 0;">
                  <tr>
                    <td align="center" bgcolor="#2563eb" style="border-radius:6px;">
                      <a href="${downloadUrl}" 
                         style="display:inline-block; padding:14px 24px; font-size:16px; color:#ffffff; text-decoration:none; font-weight:bold;">
                        ⬇ Download Video
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="font-size:14px; color:#666;">
                  If the button doesn't work, copy and paste this link into your browser:
                </p>

                <p style="font-size:14px; word-break:break-all; color:#2563eb;">
                  ${downloadUrl}
                </p>

                <p style="font-size:14px; color:#999; margin-top:30px;">
                  If you didn’t request this, just ignore this email.
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f9fafb; text-align:center; padding:15px; font-size:12px; color:#888;">
                © 2026 Captions4All. All rights reserved.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
</html>
    `
}

export const SendFailureVideoProccessHtml= ({userEmail,language}:{userEmail:string,language:string})=>{
    return `
    <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Video Processing Failed</title>
  </head>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">
    
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="padding:20px;">
      <tr>
        <td align="center">
          
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
            
            <!-- Header -->
            <tr>
              <td style="background:#dc2626; color:#ffffff; padding:20px; text-align:center;">
                <h2 style="margin:0;">⚠️ Processing Failed</h2>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px; color:#333333;">
                
                <p style="font-size:16px;">
                  Hey <strong>${userEmail}</strong>,
                </p>

                <p style="font-size:16px;">
                  We tried processing your video with <strong>${language}</strong> captions, but something went wrong and the request couldn’t be completed.
                </p>

                <p style="font-size:16px;">
                  This usually happens due to:
                </p>

                <ul style="font-size:14px; color:#555;">
                  <li>Unsupported or corrupted video file</li>
                  <li>Temporary server or processing error</li>
                  <li>Unexpected issue while generating captions</li>
                </ul>

                <p style="font-size:16px;">
                  You can try again using the button below 👇
                </p>

              

                <p style="font-size:14px; color:#666;">
                  If the issue keeps happening, you might want to try a different video file or check your input settings.
                </p>

                <p style="font-size:14px; color:#999; margin-top:30px;">
                  If you didn’t request this, you can safely ignore this email.
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f9fafb; text-align:center; padding:15px; font-size:12px; color:#888;">
                © 2026 Captions4All. All rights reserved.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
</html>
    `
}