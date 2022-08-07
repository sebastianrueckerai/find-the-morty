import {
  configureStore,
  AnyAction,
  combineReducers,
  PreloadedState,
} from "@reduxjs/toolkit";
import { GraphQLClient, gql } from "graphql-request";
import {
  MAX_SECONDS_IN_ROUND,
  GAME_END_STATES,
  NUM_CHARACTERS_ON_SCREEN,
} from "../constants";
import { fisherYatesShuffle } from "../utils/randomShuffle";
import type { Character, GameData } from "../types";
import { actionTypes } from "./actionTypes";

const ENDPOINT = "https://rickandmortyapi.com/graphql";

const get_character_query_for_page = (page: number): string =>
  gql`
  query getCharacters {
    characters(page: ${page}) {
      info {
        next
      }
      results {
        id, name, image
      }
    }
  }
`;
const graphQLClient = new GraphQLClient(ENDPOINT);

/* 
This file could be split further (action creators, reducers...)
but this would split the game logic also and make it harder to reason about.
So while the whikle thing is ~200 lines I prefer to leave it like this.
*/

function setLoading() {
  return { type: actionTypes.SET_LOADING };
}

function setError(error: string) {
  return { type: actionTypes.SET_ERROR, error };
}

function setCharacters(characters: Character[]) {
  return { type: actionTypes.SET_CHARACTERS, characters };
}

function setNewRound() {
  return { type: actionTypes.SET_NEW_ROUND };
}

function setRoundTimeLeft(roundTimeLeft: number) {
  return { type: actionTypes.SET_ROUND_TIME_LEFT, roundTimeLeft };
}

const fetchCharacters = (dispatch: AppDispatch) => {
  // TODO: We could load only enough character for the 1st round initially & start the game earlier
  // while fetching more characters in the background
  const characters: Character[] = [];
  const loadInChunks = (page: number): Promise<void> => {
    const query = get_character_query_for_page(page);
    return graphQLClient.request(query).then((response) => {
      characters.push(...response.characters.results);
      if (!!response.characters.info.next)
        return loadInChunks(response.characters.info.next);
    });
  };
  return loadInChunks(1).then(() => {
    return dispatch(setCharacters(characters));
  });
};

function updateRoundTimer() {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    if (getState().game.gameOn) {
      const updatedTime: number = getState().game.roundEndsAt - Date.now();
      if (updatedTime < 0) {
        dispatch(loose());
      } else {
        dispatch(setRoundTimeLeft(updatedTime));
        setTimeout(() => {
          dispatch(updateRoundTimer());
        }, 50);
      }
    }
  };
}

function startRound() {
  return (dispatch: AppDispatch) => {
    dispatch(setNewRound());
    dispatch(updateRoundTimer());
  };
}

function loadGame() {
  return (dispatch: AppDispatch) => {
    dispatch(setLoading());
    fetchCharacters(dispatch)
      .then(() => {
        return dispatch(startRound());
      })
      .catch((error: Error) => {
        console.error(error.toString());
        return dispatch(setError(error.message));
      });
  };
}

function chooseCharacter(character: Character) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    if (!getState().game.gameOn) return;
    if (character.id === getState().game.characterToFind.id) {
      dispatch(win());
    } else {
      dispatch(loose());
    }
  };
}

function loose() {
  return { type: actionTypes.LOOSE };
}

function win() {
  return { type: actionTypes.WIN };
}

const INITAL_STATE_CHARACTERS: GameData = {
  loading: true,
  gameOn: false,
  error: null,
  characters: [],
  characterToFind: null,
  roundTimeLeft: 0,
  roundEndsAt: 0,
  endState: GAME_END_STATES.LOST,
};

const gameReducer = (state = INITAL_STATE_CHARACTERS, action: AnyAction) => {
  switch (action.type) {
    case actionTypes.SET_CHARACTERS:
      return {
        ...state,
        characters: action.characters,
        loading: false,
        error: null,
      };
    case actionTypes.SET_NEW_ROUND:
      const shuffeledCharacters = fisherYatesShuffle([...state.characters]);
      const upperLimit = Math.min(
        NUM_CHARACTERS_ON_SCREEN,
        shuffeledCharacters.length
      );
      const randsIdx = Math.floor(Math.random() * upperLimit);
      const newCharacterToFind = shuffeledCharacters[randsIdx];
      return {
        ...state,
        characters: shuffeledCharacters,
        characterToFind: newCharacterToFind,
        roundTimeLeft: MAX_SECONDS_IN_ROUND,
        roundEndsAt: Date.now() + MAX_SECONDS_IN_ROUND * 1000,
        gameOn: true,
        loading: false,
        error: null,
      };
    case actionTypes.SET_ROUND_TIME_LEFT:
      return {
        ...state,
        roundTimeLeft: action.roundTimeLeft,
      };
    case actionTypes.LOOSE:
      return {
        ...state,
        gameOn: false,
        roundTimeLeft: 0,
        endState: GAME_END_STATES.LOST,
      };
    case actionTypes.WIN:
      return {
        ...state,
        gameOn: false,
        roundTimeLeft: 0,
        endState: GAME_END_STATES.WON,
      };
    case actionTypes.SET_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case actionTypes.SET_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  game: gameReducer,
});

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
};

export { loadGame, chooseCharacter, startRound };
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
