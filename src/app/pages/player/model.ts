export interface Player {
  title: string,
  table: {
    columns: {
      id: column,
      name: column,
      artist: column
    }
  },
  toolbar: {
    icons: {
      prev: string,
      play: string,
      pause: string,
      next: string,

    }
  }
}

interface column {
  title: string,
  def: string
}
