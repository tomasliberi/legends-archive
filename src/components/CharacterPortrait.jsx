function portraitValue(value, fallback) {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
}

export function getPortraitStyle(character) {
  const positionX = portraitValue(character.photoPositionX, 50);
  const positionY = portraitValue(character.photoPositionY, 50);
  const zoom = portraitValue(character.photoZoom, 1);

  return {
    objectPosition: `${positionX}% ${positionY}%`,
    transform: `scale(${zoom})`,
    transformOrigin: `${positionX}% ${positionY}%`,
  };
}

export default function CharacterPortrait({ character, frameClassName = "", imageClassName = "" }) {
  if (!character.photo) {
    return null;
  }

  return (
    <div className={`overflow-hidden ${frameClassName}`}>
      <img
        src={character.photo}
        alt={character.name}
        className={`h-full w-full object-cover ${imageClassName}`}
        style={getPortraitStyle(character)}
      />
    </div>
  );
}
