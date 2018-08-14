
import {exec} from 'child_process'
import { create } from 'domain'
import * as fs from 'fs-extra'
import * as path from 'path'
import { Writable } from 'stream'

import { writeCreate } from './create'
import { writeDelete } from './delete'
import { writeEditorInterfaceChange } from './editor_interface'
import { IContentType } from './model'
import { writeModify } from './modify'
import { FilePerContentTypeRunner } from './runners/file_per_content_type'
import { WriteSingleFileRunner } from './runners/write_single_file'
import { loadSources } from './source'
import { indexByContentType, indexById } from './utils'

export interface IArgs {
  from: string,
  to: string,
  oneFile: boolean,
  outDir: string,
  managementToken: string
}

export default async function Run(args: IArgs) {

  const [from, to] = await loadSources(args)

  const fromTypes = indexById(from.contentTypes)
  const fromEditorInterfaces = indexByContentType(from.editorInterfaces)
  const toTypes = indexById(to.contentTypes)
  const toEditorInterfaces = indexByContentType(to.editorInterfaces)

  const HEADER = `import Migration from 'contentful-migration'

// Generated by contentful-schema-diff
// from ${args.from}
// to   ${args.to}
export = function (migration: Migration, { makeRequest, spaceId, accessToken }) {
`

  const FOOTER = `
}
`

  const runner = args.oneFile ?
    new WriteSingleFileRunner(args.outDir, HEADER, FOOTER) :
    new FilePerContentTypeRunner(args.outDir, HEADER, FOOTER)

  await runner.init()

  const promises = runner.run(Object.keys(toTypes), async (id, chunkWriter, context) => {
    if (fromTypes[id]) {
      await writeModify(fromTypes[id], toTypes[id], chunkWriter, context)
    } else {
      await writeCreate(toTypes[id], chunkWriter, context)
    }
    return writeEditorInterfaceChange(fromEditorInterfaces[id], toEditorInterfaces[id], chunkWriter, context)
  })
  promises.push(...runner.run(Object.keys(fromTypes), (id, chunkWriter, context) => {
    if (toTypes[id]) {
      // handled above in 'writeModify'
      return
    }

    return writeDelete(id, chunkWriter, context)
  }))

  await Promise.all(promises)

  return await runner.close()
}
