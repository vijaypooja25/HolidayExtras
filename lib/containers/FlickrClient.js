import React, { PropTypes } from 'react';
import unionBy from 'lodash.unionby';
import fetchJsonp from 'fetch-jsonp';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import Item from '../components/Item';


const { string, number } = PropTypes;


function extractAuthorNikname(str) {
  return str.substring(str.lastIndexOf('(') + 1, str.lastIndexOf(')'));
}

function mapFeedResponse(feedData) {
  return feedData.items.map((item) => {
    return {
      author: extractAuthorNikname(item.author),
      photoUrl: item.media.m,
        title: item.title,
        link: item.link,
      tags: item.tags,
     
    }
  })
}

function fetchFeed(url, cb) {
  fetchJsonp(url, {
    jsonpCallback: 'jsoncallback',
 
  })
  .then(function(response) {
    return response.json()
  }).then(function(json) {
    return cb(json);
  })
  .catch(function(ex) {
    console.log('parsing failed', ex)
  })
}

class FlickrClient extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            apiUrl: 'http://api.flickr.com/services/feeds/photos_public.gne?format=json',
        }
    }

    componentDidMount() {
        const init = () => {

            fetchFeed(this.state.apiUrl, (feedData) => {
                    const newFeedItems = mapFeedResponse(feedData);
                    this.setState({
                      items: unionBy(this.state.items, newFeedItems, 'photoUrl')
                  });
                });
            
            setTimeout(init, this.props.fetchInterval);
        }
        init();
    }

    updateItemState(newFeedItems) {
      this.setState({
        items: newFeedItems
    });
    }

    handleSearch(event) {

        if (event.key === 'Enter') {
              event.preventDefault();
            event.preventDefault();
            this.state.apiUrl= 'http://api.flickr.com/services/feeds/photos_public.gne?format=json&tags=' + event.target.value;
            console.log("url:" + this.state.apiUrl);
            const search = () => {

              fetchFeed(this.state.apiUrl, (feedData) => {
                      const newFeedItems = mapFeedResponse(feedData);
                      this.setState({
                        items: unionBy(newFeedItems, this.state.items, 'photoUrl')
                    });
                  });
              
              setTimeout(search, 30000);
          }
          search();
        }
    }

  render() {
    return (
      <div>
        <Navbar fixedTop inverse>
          <Navbar.Header>
            <Navbar.Brand>
              Flickr Client
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
                    <input
                        placeholder="Search the tags..."
                        type="text"
                        onKeyPress={this.handleSearch.bind(this)}
                    ></input>
          </Nav>
        </Navbar>
        <ul className="list">
          {
            this.state.items.map((item) => (
              <Item
                    key={item.photoUrl}
                    photoTitle={item.title}
                    photoLink={item.link}
                    tags={item.tags}
                author={item.author}
                photoUrl={item.photoUrl}
              />
            ))
          }
        </ul>
      </div>
    );
  }

}

FlickrClient.propTypes = {
  feedApi: string.isRequired,
  fetchInterval: number.isRequired
};

export default FlickrClient;