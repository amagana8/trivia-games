import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Button, TextField, Typography } from "@mui/material";
import { produce } from "immer";
import { useAtom, useAtomValue } from "jotai";
import { FC, memo, useEffect } from "react";
import { gridGameAtom } from "../../../atoms/gridGame";
import { isEditingAtom } from "../../../atoms/isEditing";
import { Column } from "./Column/Column";

export const QuestionGrid: FC = memo(() => {
  const [gridGame, setGridGame] = useAtom(gridGameAtom);
  const isEditing = useAtomValue(isEditingAtom);

  useEffect(() => {
    return monitorForElements({
      onDrop: ({ source, location }) => {
        const origin = location.initial.dropTargets[0];
        const destination = location.current.dropTargets[0];

        setGridGame(
          produce((draft) => {
            if (origin) {
              draft.grid[Number(origin.data.categoryIndex)].questions[
                Number(origin.data.questionIndex)
              ] = "";
            }

            if (destination) {
              draft.grid[Number(destination.data.categoryIndex)].questions[
                Number(destination.data.questionIndex)
              ] = String(source.data.questionId);
            }
          })
        );
      },
    });
  }, []);

  return (
    <>
      <div>
        {isEditing ? (
          <TextField />
        ) : (
          <Typography variant="h3">Title</Typography>
        )}
        <div style={{ display: "flex", columnGap: "1rem" }}>
          {gridGame.grid.map(({ category, questions }, index) => (
            <Column
              key={index}
              category={category}
              questions={questions}
              categoryIndex={index}
            />
          ))}
        </div>
      </div>
      {isEditing && (
        <Button
          onClick={() =>
            setGridGame(
              produce((draft) => {
                draft.grid.push({
                  category: "",
                  questions: ["", "", "", "", ""],
                });
              })
            )
          }
        >
          Add Column
        </Button>
      )}
    </>
  );
});
