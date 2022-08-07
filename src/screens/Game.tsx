import React, { FC, useEffect } from "react";

import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Backdrop from "@mui/material/Backdrop";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";

import { startRound, chooseCharacter, loadGame } from "../store/store";
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector,
} from "../store/hooks";

import CharacterCard from "../components/CharacterCard";
import { WinImage, LooseImage } from "../components/EndStateImages";
import type { Character, GameData } from "../types";

import {
  GAME_END_STATES,
  MAX_SECONDS_IN_ROUND,
  NUM_CHARACTERS_ON_SCREEN,
} from "../constants";

const useStyles = makeStyles(() => {
  return {
    root: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      minHeight: "100vh",
    },
  };
});

const Game: FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadGame());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const game: GameData = useSelector((state) => state.game);

  const secondsLeftInRound: number = Math.max(0, game.roundTimeLeft / 1000.0);

  const onCharacterSelected = (character: Character) => {
    dispatch(chooseCharacter(character));
  };

  if (!!game.error) {
    return (
      <Typography variant="h1" component="div" gutterBottom>
        {`Something went wrong: ${game.error}`}
      </Typography>
    );
  }
  if (game.loading) {
    return (
      <Typography variant="h1" component="div" gutterBottom>
        Loading...
      </Typography>
    );
  }
  return (
    <Box className={classes.root}>
      <Backdrop
        sx={{ zIndex: (theme: Theme) => theme.zIndex.drawer + 1 }}
        open={!game.gameOn}
        onClick={() => dispatch(startRound())}
      >
        {game.endState === GAME_END_STATES.WON ? WinImage : LooseImage}
      </Backdrop>
      {!!game.characterToFind && (
        <Typography variant="h1" component="div" gutterBottom>
          {`Quick! Find ${game.characterToFind.name}!`}
        </Typography>
      )}
      <Box sx={{ width: "100%", maxWidth: 1000 }}>
        <LinearProgress
          style={{ height: 20 }}
          variant="determinate"
          color="inherit"
          value={(secondsLeftInRound / MAX_SECONDS_IN_ROUND) * 100}
        />
      </Box>
      <Box sx={{ width: "100%", maxWidth: 1000, justifySelf: "center" }}>
        <Grid
          container
          spacing={1}
          columns={{ xs: 4, sm: 5, md: 6, lg: 7, xl: 8 }}
        >
          {game.characters
            .slice(0, NUM_CHARACTERS_ON_SCREEN)
            .map((character: Character) => (
              <Grid item key={character.id} xs={1}>
                <CharacterCard {...{ onCharacterSelected, character }} />
              </Grid>
            ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Game;
