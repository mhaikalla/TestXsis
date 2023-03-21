import { QueryFilter,QueryFilterParam } from "./QueryFilter"
export interface Movies {
  id  :  number,
  title : string
  description : string,          
  rating : number,
  image : string
  created_at : Date
  updated_at : Date
}

export class MovieFilter extends QueryFilter<Movies> {
  title? : string | null
  desciption? : string | null
  rating? : number | null
  rating_from? : number | null
  rating_to? : number | null
  constructor(
    filter: QueryFilterParam<Movies>,
    title? : string,
    desciption? : string,
    rating? : number,
    rating_from? : number,
    rating_to? : number
  ) {
    super(filter);
    this.title = title ? String(title) : null
    this.desciption = title ? String(desciption) : null
    this.rating = rating ? rating : Number(rating)
    this.rating_from = rating_from ? Number(rating_from) : null,
    this.rating_to = rating_to ? Number(rating_to) : null
  }
}
