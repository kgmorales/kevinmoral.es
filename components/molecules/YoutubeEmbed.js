import React from 'react'
import PropTypes from 'prop-types'

const YoutubeEmbed = ({ embedId }) => (
  <div className="aspect-[16/9]">
    <iframe
      className="absolute inset-0 h-full w-full"
      src={`https://www.youtube.com/embed/${embedId}`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Embedded youtube"
    />
  </div>
)

YoutubeEmbed.propTypes = {
  embedId: PropTypes.string.isRequired,
}

export default YoutubeEmbed
