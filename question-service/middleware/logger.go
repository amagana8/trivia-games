package middleware

import (
	"log"
	"net/http"
	"time"
)

type logWriter struct {
	http.ResponseWriter
	statusCode int
}

func (lw *logWriter) WriteHeader(statusCode int) {
	lw.ResponseWriter.WriteHeader(statusCode)
	lw.statusCode = statusCode
}

// Unwrap supports http.ResponseController
func (lw *logWriter) Unwrap() http.ResponseWriter { return lw.ResponseWriter }

func Logger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		lw := &logWriter{
			ResponseWriter: w,
			statusCode:     http.StatusOK,
		}

		next.ServeHTTP(lw, r)
		log.Println(lw.statusCode, r.Method, r.URL.Path, time.Since(start))
	})
}
