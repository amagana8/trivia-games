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
  const setGridGame = useSetAtom(gridGameAtom);
  const [isEditing, setIsEditing] = useAtom(isEditingAtom);
  const [showList, setShowList] = useState(false);
  const createGridGame = trpc.gridGame.createGridGame.useMutation({
    onSuccess: (data) => {
      setGridGame({ title: data.title, grid: data.grid, id: data.id });
      setIsEditing(true);
    },
  });
  const { data } = trpc.gridGame.getAllGridGames.useQuery(undefined, {
    enabled: showList,
  });

  if (!isEditing) {
    return (
      <>
        <Button
          onClick={() => {
            createGridGame.mutate({
              authorId: "672ae769cb6a1ba56cd5b7a6", //TODO: replace this with the actual authorId when user service is ready
              title: "",
              grid: [],
            });
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
                  setGridGame({
                    id: gridGame.id,
                    title: gridGame.title,
                    grid: gridGame.grid,
                  });
                }}
              >
                {gridGame.title}
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
