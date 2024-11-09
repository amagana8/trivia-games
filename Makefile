generate-go-protos:
	protoc --proto_path=${PWD}/proto --go_out=${PWD}/backend/pkg/pb --go_opt=paths=source_relative --go-grpc_out=${PWD}/backend/pkg/pb --go-grpc_opt=paths=source_relative ${PWD}/proto/*.proto
generate-bff-protos:
	cd bff && pnpm run proto:generate
generate-all:
	make generate-go-protos
	make generate-bff-protos
