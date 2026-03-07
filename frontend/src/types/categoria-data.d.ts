export interface Categoria {
  id: number | string
  nome?: string
  criadoEm?: string
}

export interface CategoriaForm {
  id?: number | string
  nome?: string
}

export interface PropsCategoria {
  visible: boolean
  tipoForm?: string
  categoria?: Categoria
  handleClose: () => void
}
