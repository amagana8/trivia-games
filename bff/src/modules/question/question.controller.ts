import { Body, Controller, Delete, Get, Inject, OnModuleInit, Param, Post, Put } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { QuestionServiceClient } from "src/pb/question";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { QuestionListDto } from "./dto/question-list.dto";
import { QuestionDto } from "./dto/question.dto";
import { UpdateQuestionDto } from "./dto/update-question.dto";
import { DeleteQuestionDto } from "./dto/delete.question.dto";

@Controller('question')
export class QuestionController implements OnModuleInit {
    private questionService: QuestionServiceClient;

    constructor(@Inject('QUESTION_PACKAGE') private client: ClientGrpc) {}

    onModuleInit() {
        this.questionService = this.client.getService<QuestionServiceClient>('QuestionService');
    }

    @Post()
    createQuestion(@Body() createQuestionDto: CreateQuestionDto): Observable<QuestionDto> {
        return this.questionService.createQuestion(createQuestionDto);
    }

    @Get(':id')
    getQuestion(@Param('id') id: string): Observable<QuestionDto> {
        return this.questionService.getQuestion({ id });
    }

    @Get()
    getAllQuestions(): Observable<QuestionListDto> {
        return this.questionService.getAllQuestions({});
    }

    @Put(':id')
    updateQuestion(@Param('id')id : string, @Body() updateQuestionDto: UpdateQuestionDto): Observable<QuestionDto> {
        return this.questionService.updateQuestion({...updateQuestionDto, id});
    }

    @Delete(':id')
    deleteQuestion(@Param('id') id: string): Observable<DeleteQuestionDto> {
        return this.questionService.deleteQuestion({ id });
    }
}