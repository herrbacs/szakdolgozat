from typing import Callable, Any
from sqlalchemy import Select
from sqlalchemy.orm import Session
from fastapi import Query
from src.schemas.pagination import PaginationQuery, PagedResponse
import math
from typing import TypeVar

T = TypeVar("T")

def get_pagination(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
) -> PaginationQuery:
    return PaginationQuery(page=page, page_size=page_size)

def paginate(
    *,
    db: Session,
    pagination: PaginationQuery,
    data_stmt: Select,
    count_stmt: Select,
    map_row: Callable[[Any], T],
) -> PagedResponse[T]:
    total = db.execute(count_stmt).scalar_one()
    total_pages = max(1, math.ceil(total / pagination.page_size)) if total else 1

    rows = db.execute(
        data_stmt.offset(pagination.offset).limit(pagination.page_size)
    ).all()

    items = [map_row(row) for row in rows]

    return PagedResponse[T](
        items=items,
        page=pagination.page,
        page_size=pagination.page_size,
        total=total,
        total_pages=total_pages,
    )