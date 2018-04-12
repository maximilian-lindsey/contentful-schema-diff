
export interface IContentType {
  sys: {
    space: {
      sys: {
        type: "Link",
        linkType: "Space",
        id: string
      }
    },
    id: string,
    type: "ContentType",
    createdAt: string,
    updatedAt: string,
    createdBy: {
      sys: {
        type: "Link",
        linkType: "User",
        id: string
      }
    },
    updatedBy: {
      sys: {
        type: "Link",
        linkType: "User",
        id: string
      }
    },
    publishedCounter: 1,
    version: 2,
    publishedBy: {
      sys: {
        type: "Link",
        linkType: "User",
        id: string
      }
    },
    publishedVersion: 1,
    firstPublishedAt: string,
    publishedAt: string
  },
  displayField: string,
  name: string,
  description: string,
  fields: [
    {
      id: string,
      name: string,
      type: FieldType,
      localized: false,
      required: true,
      validations: IValidation[],
      disabled: false,
      omitted: false,
      linkType: "Entry" | "Asset",
      items: {
        type: FieldType,
        validations: IValidation[],
        linkType: "Entry" | "Asset"
      }
    }
  ]
}


export type FieldType = 'Symbol' | 'Text' | 'Integer' | 'Number' | 'Date' | 'Boolean' | 'Object' | 'Location' | 'Array' | 'Link'

export type LinkMimetype = 'attachment' | 'plaintext' | 'image' | 'audio' | 'video' | 'richtext' | 
  'presentation' | 'spreadsheet' | 'pdfdocument' | 'archive' | 'code' | 'markup'

export interface IValidation {
  /** Takes an array of content type ids and validates that the link points to an entry of that content type. */
  linkContentType?: string[],
  /** Takes an array of values and validates that the field value is in this array. */
  in?: string[],
  /** Takes a MIME type group name and validates that the link points to an asset of this group. */
  linkMimetypeGroup?: LinkMimetype[],
  /** Takes min and/or max parameters and validates the size of the array (number of objects in it). */
  size?: { max?: number, min?: number },
  /** Takes min and/or max parameters and validates the range of a value. */
  range?: { max?: number, min?: number},
  /** Takes a string that reflects a JS regex and flags, validates against a string. See JS reference for the parameters. */
  regexp?: { pattern: string, flags?: string },
  /** Validates that there are no other entries that have the same field value at the time of publication. */
  unique?: true,
  /** Validates that a value falls within a certain range of dates. */
  dateRange?: { min?: string, max?: string },
  /** Validates that an image asset is of a certain image dimension. */
  assetImageDimensions?: { width: { min?: number, max?: number }, height: { min?: number, max?: number } }
  /** Validates that an asset is of a certain file size. */
  assetFileSize?: { max?: number, min?: number },

  message?: string

  /** Other validations */
  [validation: string]: any
}