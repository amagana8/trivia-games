import { Button, List, ListItem } from "@mui/material";
import { useAtom, useSetAtom } from "jotai";
import { FC, useState } from "react";
import { gridGameAtom } from "../../atoms/gridGame";
import { isEditingAtom } from "../../atoms/isEditing";
import { trpc } from "../../trpc";
import * as styles from "./GridGame.styles";
import { QuestionBank } from "./QuestionBank/QuestionBank";
import { QuestionGrid } from "./QuestionGrid/QuestionGrid";

export const GridGame: FC = () => {
  const [grid, setGrid] = useAtom(gridGameAtom);
  const setIsEditing = useSetAtom(isEditingAtom);
  const [showList, setShowList] = useState(false);
  const { data } = trpc.gridGame.getAllGridGames.useQuery(undefined, {
    enabled: showList,
  });

  if (!grid.length) {
    return (
      <>
        <Button
          onClick={() => {
            setGrid([{ category: "", questions: ["", "", "", "", ""] }]);
            setIsEditing(true);
          }}
        >
          Create New Game
        </Button>
        <Button onClick={() => setShowList(true)}>Edit Game</Button>
        {showList && (
          <List>
            {data?.gridGames.map((gridGame) => (
              <ListItem
                key={gridGame.id}
                onClick={() => {
                  setIsEditing(true);
                  setGrid(gridGame.grid);
                }}
              >
                {gridGame.id}
              </ListItem>
            ))}
          </List>
        )}
      </>
    );
  }

  return (
    <div className={styles.root}>
      <QuestionBank />

      <QuestionGrid />
    </div>
  );
};
