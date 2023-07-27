export interface TZHRequestParams {
  url: string
  conditions?: { [x:string]: any }
  config?: { [x:string]: any }
  timeout?: number
  notNeedBackEndErrorMessage?: boolean
  errorMessage?: string
  successMessage?: string
}

export interface TZHRequestResult {
  success: boolean
  errorCode: string
  errorMessage: string
  exceptionMessage: string
  data: any
}