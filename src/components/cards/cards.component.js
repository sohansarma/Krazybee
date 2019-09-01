import React,{ Component } from 'react';
import LazyLoad from '../lazyLoad/lazyLoad';
import './cards.style.css'

const MAX_POSSIBLE_HORIZONTAL = 8;

class Cards extends Component {
	constructor(props){
		super(props)
		this.state = {
			albumsData : [],
			activeAlbums: [],
	   		loading: true,
	   		activeIndex: 0,
	   		disabled: {
	   			next: false,
	   			prev: true
	   		}
		}
	}

 async componentDidMount(){
 	 const { albumId } = this.props;
 	 const { activeIndex } = this.state;
     const albumsData = await fetch(`https://jsonplaceholder.typicode.com/photos?albumId=${albumId}`)
                          .then(response => response.json());
		this.setState({
			albumsData,
			loading: false,
			activeIndex: activeIndex + 1,
			activeAlbums: albumsData.slice(0, (activeIndex + 1) * MAX_POSSIBLE_HORIZONTAL)
		});
	}

	nextRow = () => {
   	if (!this.state.disabled.next) {
      const { albumsData, activeIndex, disabled, activeAlbums } = this.state;
    const lastIndex = MAX_POSSIBLE_HORIZONTAL * (activeIndex + 1);
    this.setState({
      activeAlbums: activeAlbums.concat(albumsData.slice(activeIndex * MAX_POSSIBLE_HORIZONTAL, (activeIndex + 1) * MAX_POSSIBLE_HORIZONTAL)),
      activeIndex: activeIndex + 1,
      disabled: {
        ...disabled,
        next: lastIndex >= albumsData.length - 1,
        prev: false,
      }
    })
    }
    }

   prevRow = () => {
    if (!this.state.disabled.prev) {
        const { albumsData, activeIndex, disabled } = this.state;
    const lastIndex = MAX_POSSIBLE_HORIZONTAL *( activeIndex - 1);
    const activeAlbums = albumsData.slice(0, lastIndex)
    this.setState({
      activeAlbums: activeAlbums,
      activeIndex: activeIndex + 1,
      disabled: {
        ...disabled,
        prev: lastIndex <= MAX_POSSIBLE_HORIZONTAL,
        next: false
      }
    })
    }
   }

   redirectUrl = (url) => {
      window.location.href = url;
      
   }


	render(){
		const { activeAlbums, loading } = this.state;
		return(
			<div className="carousel">
              <div className = "d-flex cards_scroll">
                <div className="card_container_wrapper d-flex">
                   {activeAlbums.map(albumData => (
                     <div className = "card_container" onClick={() => this.redirectUrl(albumData.url)}>
                        <img alt = "" src={albumData.thumbnailUrl} />
                         <div className = "album_title">{albumData.title}</div>
                         <div>id: {albumData.id}</div>
                         {/*<div>{albumData.url}</div>*/}
                     </div>
                  ))}
                </div>
                {!loading &&  <LazyLoad loadMore={() => {
                  this.nextRow();
                 }} />}
              </div>
             {/*  <div className="">
							            <div onClick={this.prevRow}><i className="fa carousel_button carousel-button-left">&#xf104;</i></div>
							            <div onClick={this.nextRow}><i className="fa carousel_button carousel-button-right">&#xf105;</i></div>
				       </div>*/}
				 </div>
			);
	}
}

export default Cards;