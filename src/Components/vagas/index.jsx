import style from './vagas.module.css'
import ExploreCategorias from './../ExploreCategories/index';

export default function Vagas() {
  return (
    <div className={style.vagas}>
      <ExploreCategorias />
    </div>
  )
}
