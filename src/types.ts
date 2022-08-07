export interface Character {
  id: number;
  name: string;
  image: string;
}

export interface GameData {
  loading: boolean;
  gameOn: boolean;
  error: string | null;
  characters: Character[];
  characterToFind: Character | null;
  roundTimeLeft: number;
  roundEndsAt: number;
  endState: string;
}
