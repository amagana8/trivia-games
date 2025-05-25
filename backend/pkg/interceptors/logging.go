package interceptors

import (
	"context"
	"fmt"
	"log"

	"github.com/grpc-ecosystem/go-grpc-middleware/v2/interceptors/logging"
	"google.golang.org/grpc"
)

func interceptorLogger(l *log.Logger) logging.Logger {
	return logging.LoggerFunc(func(_ context.Context, lvl logging.Level, msg string, fields ...any) {
		switch lvl {
		case logging.LevelDebug:
			msg = fmt.Sprintf("DEBUG :%v", msg)
		case logging.LevelInfo:
			msg = fmt.Sprintf("INFO :%v", msg)
		case logging.LevelWarn:
			msg = fmt.Sprintf("WARN :%v", msg)
		case logging.LevelError:
			msg = fmt.Sprintf("ERROR :%v", msg)
		default:
			panic(fmt.Sprintf("unknown level %v", lvl))
		}
		l.Println(append([]any{"msg", msg}, fields...))
	})
}

var opts = []logging.Option{
	logging.WithLogOnEvents(logging.PayloadReceived, logging.PayloadSent),
}

func UnaryServerLogging(logger *log.Logger) grpc.UnaryServerInterceptor {
	interceptor := logging.UnaryServerInterceptor(interceptorLogger(logger), opts...)

	return interceptor
}

func StreamServerLogging(logger *log.Logger) grpc.StreamServerInterceptor {
	interceptor := logging.StreamServerInterceptor(interceptorLogger(logger), opts...)

	return interceptor
}
