import { Body, Controller, Delete, Get, Inject, OnModuleInit, Param, Post, Put } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { QuestionServiceClient } from "src/pb/question";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { UpdateQuestionDto } from "./dto/update-question.dto";

@Controller('question')
export class QuestionController implements OnModuleInit {
    private questionService: QuestionServiceClient;

    constructor(@Inject('QUESTION_PACKAGE') private client: ClientGrpc) {}

    onModuleInit() {
        this.questionService = this.client.getService<QuestionServiceClient>('QuestionService');
    }

    @Post()
    async createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
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
    async updateQuestion(@Param('id')id : string, @Body() updateQuestionDto: UpdateQuestionDto) {
        return this.questionService.updateQuestion({...updateQuestionDto, id});
    }

    @Delete(':id')
    async deleteQuestion(@Param('id') id: string) {
        return this.questionService.deleteQuestion({ id });
    }
}