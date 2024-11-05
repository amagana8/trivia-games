generate:
	protoc --proto_path=${PWD}/proto --go_out=${PWD}/backend/pkg/pb --go_opt=paths=source_relative --go-grpc_out=${PWD}/backend/pkg/pb --go-grpc_opt=paths=source_relative ${PWD}/proto/*.proto
	cd bff && pnpm run proto:generate