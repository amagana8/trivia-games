import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Card, CardContent } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { memo, useEffect, useRef, useState, type FC } from "react";
import { trpc } from "../../../trpc";
import * as styles from "./QuestionCard.styles";

export const QuestionCard: FC<{ questionId: string }> = memo(({ questionId }) => {
  const utils = trpc.useUtils();
  const queryClient = useQueryClient();

  const { data } = trpc.question.getQuestion.useQuery(
    { id: questionId },
    {
      initialData:
        utils.question.getAllQuestions.getData()?.questionMap[questionId],
      staleTime: 1000 * 60 * 15,
        initialDataUpdatedAt: () => {
        const queryKey = getQueryKey(
          trpc.question.getAllQuestions,
          undefined,
          "query"
        );
        return queryClient.getQueryState(queryKey)?.dataUpdatedAt;
      },
    }
  );

  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    return draggable({
      element: el,
      getInitialData: () => ({ questionId }),
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    });
  }, []);

  return (
      <Card
        ref={ref}
        sx={{ opacity: dragging ? 0.5 : 1 }}
        className={styles.card}
      >
        <CardContent>{data?.query}</CardContent>
      </Card>
  );
});
