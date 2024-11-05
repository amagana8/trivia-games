import { Controller, Get, Inject, OnModuleInit, Param, Body, Post, Put, HttpException, HttpStatus, Delete } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { CreateQuestionRequest, Question, QuestionServiceClient } from "src/pb/question";

@Controller('question')
export class QuestionController implements OnModuleInit {
    private questionService: QuestionServiceClient;

    constructor(@Inject('QUESTION_PACKAGE') private client: ClientGrpc) {}

    onModuleInit() {
        this.questionService = this.client.getService<QuestionServiceClient>('QuestionService');
    }

    @Post()
    async createQuestion(@Body() createQuestionDto: CreateQuestionRequest) {
        return this.questionService.createQuestion(createQuestionDto);
    }

    @Get(':id')
    async getQuestion(@Param('id') id: string) {
        return this.questionService.getQuestion({ id });
    }

    @Get()
    async getAllQuestions() {
        return this.questionService.getAllQuestions({});
    }

    @Put(':id')
    async updateQuestion(@Param('id')id : string, @Body() updateQuestionDto: Question) {
        if (id !== updateQuestionDto.id) {
            throw new HttpException('ID in path does not match ID in body', HttpStatus.BAD_REQUEST);
        }
        return this.questionService.updateQuestion(updateQuestionDto);
    }

    @Delete(':id')
    async deleteQuestion(@Param('id') id: string) {
        return this.questionService.deleteQuestion({ id });
    }
}