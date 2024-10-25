FROM golang:1.23.2

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY *.go ./

RUN go build -o /question-service

EXPOSE 3001

CMD ["/question-service"]
