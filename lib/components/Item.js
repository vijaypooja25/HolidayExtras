import React, { PropTypes } from 'react';


const { string} = PropTypes;

const Item = ({ photoUrl,photoTitle, author, tags , photoLink}) => {
  return (
    <li className="list-item">
      <div className="list-content">
              <img src={photoUrl} alt="" />
              <a href={photoLink}>Photo title: {photoTitle}</a>
              <a href="#">Author: {author}</a>
              <p>Tags: {tags}</p>
      </div>
    </li>
  );
}

Item.propTypes = {
  photoUrl: string.isRequired,
  author: string.isRequired,
};

export default Item;
