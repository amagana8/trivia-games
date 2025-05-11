package gameroom

import "github.com/amagana8/trivia-games/backend/pkg/pb"

type MinHeap []*pb.BuzzerUpdate

func (h MinHeap) Len() int {
	return len(h)
}

func (h MinHeap) Less(i, j int) bool {
	return h[i].TimeElapsed.GetSeconds() < h[j].TimeElapsed.GetSeconds()
}

func (h MinHeap) Swap(i, j int) {
	h[i], h[j] = h[j], h[i]
}

func (h *MinHeap) Push(x interface{}) {
	*h = append(*h, x.(*pb.BuzzerUpdate))
}

func (h *MinHeap) Pop() interface{} {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[:n-1]
	return x
}

func (h *MinHeap) Peek() *pb.BuzzerUpdate {
	if len(*h) == 0 {
		return nil
	}
	return (*h)[0]
}
