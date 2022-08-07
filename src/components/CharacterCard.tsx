import React, { FC } from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";
import { Character } from "../types";

interface CharacterCardProps {
  character: Character;
  onCharacterSelected: (c: Character) => void;
}

const CharacterCard: FC<CharacterCardProps> = ({
  character,
  onCharacterSelected,
}) => {
  return (
    <Card sx={{ maxWidth: 200 }}>
      <CardActionArea
        onClick={() => onCharacterSelected(character)}
        data-testid={`${character.id}`}
      >
        <CardMedia
          component="img"
          height="140"
          image={character.image}
        />
      </CardActionArea>
    </Card>
  );
};

export default CharacterCard;
