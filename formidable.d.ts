declare module 'formidable' {
    import { IncomingMessage } from 'http';
    import { EventEmitter } from 'events';
  
    interface Fields {
      [key: string]: string | string[];
    }
  
    interface Files {
      [key: string]: File | File[];
    }
  
    interface File {
      size: number;
      filepath: string;
      originalFilename: string | null;
      newFilename: string;
      mimetype: string | null;
      mtime?: Date | null | undefined;
      hash?: string | null;
    }
  
    interface Options {
      encoding?: string;
      uploadDir?: string;
      keepExtensions?: boolean;
      maxFileSize?: number;
      maxFieldsSize?: number;
      maxFields?: number;
      hash?: string | boolean;
      multiples?: boolean;
    }
  
    class IncomingForm extends EventEmitter {
      encoding: string;
      uploadDir: string;
      keepExtensions: boolean;
      maxFileSize: number;
      maxFieldsSize: number;
      maxFields: number;
      hash: string | boolean;
      multiples: boolean;
  
      constructor(options?: Options);
      parse(
        req: IncomingMessage,
        callback?: (err: any, fields: Fields, files: Files) => void
      ): void;
    }
  
    export { IncomingForm, Fields, Files, File, Options };
  }