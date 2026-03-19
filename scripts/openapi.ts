import fs from "node:fs"
import path, { dirname } from "node:path"
import {fileURLToPath} from 'node:url'
import "dotenv/config"
import openapi ,{astToString} from "openapi-typescript"
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const output = path.resolve(__dirname,"../src/types/modal-api.d.ts") 
async function main(){
    const api_url = process.env.API_URL
    if(!api_url) throw new Error("API url not found")
      const openApiUrl = `${api_url}/openapi.json`;
      console.log('fetching openapi json')
      const ast = await openapi(new URL(openApiUrl))
      const contents = astToString(ast)
      const outputDir = path.dirname(output)
      if(!fs.existsSync(outputDir)){
            fs.mkdirSync(outputDir, { recursive: true });
      }
      fs.writeFileSync(output,contents);
      console.log('finished writing file')
}
main()