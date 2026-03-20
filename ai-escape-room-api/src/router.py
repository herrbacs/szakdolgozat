from fastapi import APIRouter
from src.routes.auth_routes import router as auth_router
from src.routes.levels_routes import router as levels_router
from src.routes.sprites_routes import router as sprites_router
from src.routes.token_routes import router as tokens_router
from src.routes.users_routes import router as users_router

router = APIRouter()

router.include_router(auth_router)
router.include_router(tokens_router)
router.include_router(users_router)
router.include_router(levels_router)
router.include_router(sprites_router)

@router.get("/")
def hello_world() -> dict[str, str]:
    return {"message": "Hello World"}

