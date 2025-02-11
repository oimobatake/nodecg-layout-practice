import React from "react";

interface StreamEmbedProps {
  id?: string;
  streamType?: string;
  position: string;
}

export const StreamEmbed: React.FC<StreamEmbedProps> = ({ id, streamType, position }) => {
  if (!id) return null;

  const URL =
    streamType === "twitch"
      ? `https://player.twitch.tv/?channel=${id}&parent=localhost`
      : `https://www.youtube.com/embed/${id}`;

  return (
    <iframe
      src={URL}
      allowFullScreen
      className={position}
      title="Live Stream"
      referrerPolicy="strict-origin-when-cross-origin"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    ></iframe>
  );
};
