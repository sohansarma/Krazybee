import React,{ Component } from 'react';
import Cards from '../cards/cards.component';
import LazyLoad from '../lazyLoad/lazyLoad';
import './categories.style.css';

const NO_OF_ALBUMS_IN_A_ROW = 2;

class Categories extends Component {
   constructor(props){
   	super(props)
   	this.state = {
   		albums: [],
   		activeAlbums: [],
   		loading: true,
   		activeIndex: 0,
   		disabled: {
   			next: false,
   			prev: true
   		}
   	}
   }

   async componentDidMount() {
   	const albums = await fetch('https://jsonplaceholder.typicode.com/albums')
		.then(response => response.json());
	const { activeIndex } = this.state;
	console.log("AGAYYYA response", albums.slice(0, (activeIndex + 1) * NO_OF_ALBUMS_IN_A_ROW));
	this.setState({
		albums,
		loading: false,
		activeAlbums: albums.slice(0, (activeIndex + 1) * NO_OF_ALBUMS_IN_A_ROW),
		activeIndex: activeIndex + 1,
	});
   }

   nextRow = () => {
   	const { albums, activeIndex, disabled, activeAlbums } = this.state;
   	const lastIndex = NO_OF_ALBUMS_IN_A_ROW * activeIndex + 1;
   	this.setState({
   		activeAlbums: activeAlbums.concat(albums.slice(activeIndex * NO_OF_ALBUMS_IN_A_ROW, (activeIndex + 1) * NO_OF_ALBUMS_IN_A_ROW)),
   		activeIndex: activeIndex + 1,
   		disabled: {
   			...disabled,
   			next: lastIndex >= albums.length - 1,
   		}
   	})
   }

   prevRow = () => {
   	const { albums, activeIndex, disabled } = this.state;
   	const lastIndex = NO_OF_ALBUMS_IN_A_ROW * activeIndex - 1;
   	this.setState({
   		activeAlbums: albums.slice(activeIndex * NO_OF_ALBUMS_IN_A_ROW, lastIndex),
   		activeIndex: activeIndex + 1,
   		disabled: {
   			...disabled,
   			prev: lastIndex <= 0,
   		}
   	})
   }


	render(){
		return(
             <div className = "categories_container">
               {this.state.activeAlbums.map(album => (
                	<div className = "">
                	      <div className="d-flex flex-column justify-content-start categories_header">
		                	 <div className="d-flex justify-content-start categories_title">{album.title}</div>
		                	 <div className="d-flex categories_sub_title">
			                	<div>id: {album.id}, </div>
			                	<div>userId: {album.userId}</div>
		                	 </div>
		                  </div>
                    <Cards albumId={album.id}/>
                	</div>
                ))}
               <LazyLoad loadMore={() => {
                // if(!this.state.disabled.next) {
                  this.nextRow();
                // }
               }} />
             </div>
			);
	}
}

export default Categories;