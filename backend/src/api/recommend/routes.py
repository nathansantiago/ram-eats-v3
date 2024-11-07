# builtin

# external
from fastapi import APIRouter, Request

# internal
from src.api.recommend.io import RecommendationRecommendMealInput, RecommendationRecommendMealOutput

recommendation_router: APIRouter = APIRouter(prefix="/recommendation")

@recommendation_router.post("/recommend-meal")
async def recommendation_recommend_meal(input: RecommendationRecommendMealInput, request: Request) -> RecommendationRecommendMealOutput:
    example_module: ExampleModule = request.app.state.example_module