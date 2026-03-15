type S3PresignedPost = {
  url: string
  key:string
}

export function uploadToS3(
  file: File,
  presigned: S3PresignedPost,
  onProgress?: (percent: number) => void
) {
  return new Promise<void>((resolve, reject) => {
    const formData = new FormData()
    
    // if (!presigned.fields["Content-Type"]) {
    //   formData.append("Content-Type", file.type)
    // }
    formData.append("file", file)
    const xhr = new XMLHttpRequest()
    xhr.open("PUT", presigned.url)
    xhr.upload.onprogress = (e) => {
      if (!e.lengthComputable) return
      const percent = Math.round((e.loaded / e.total) * 100)
      onProgress?.(percent)
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve()
      else reject(new Error(`Upload failed ${xhr.status}`))
    }

    xhr.onerror = () => reject(new Error("Upload failed"))

    // xhr.setRequestHeader("Content-Type", file.type);
    // xhr.setRequestHeader("Content-Length", String(file.size));
    xhr.send(file)
  })
}