FROM golang:1.23.2 AS build

# get protobuf compiler and go plugins
RUN apt-get update && \
    apt-get install -y protobuf-compiler
RUN go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
RUN go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
ENV PATH="$PATH:$(go env GOPATH)/bin"

WORKDIR /app

# generate protobuf code
COPY proto ./proto
COPY Makefile ./
RUN mkdir -p ./backend/pkg/pb
RUN make generate-go-protos

WORKDIR /app/backend

# get dependencies
COPY backend/go.mod backend/go.sum ./
RUN go mod download

# build app
COPY backend/cmd/question-service  ./cmd/question-service
COPY backend/pkg ./pkg
RUN CGO_ENABLED=0 go build -o /question-service ./cmd/question-service/main.go

# final stage
FROM alpine:3.20.3

COPY --from=build /question-service ./

EXPOSE 3001

ENTRYPOINT ["/question-service"]
