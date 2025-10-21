export function getPaginationRange (currentPage: number, totalPages: number ): (number | "ellipsis")[] {
    const delta = 2;
    const range: (number | "ellipsis")[] = [1];

    if(currentPage > delta + 2) range.push("ellipsis"); //左側に省略記号を表示するか　currentPage > 5 のとき → [1, "ellipsis", ...] (例：現在ページが6以上なら、2〜4ページは省略して「...」にする)

    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);
    for (let i = start; i <= end; i++) range.push(i);

    if(currentPage < totalPages - delta -1) range.push("ellipsis"); //右側に省略記号を表示するか

    range.push(totalPages);

    return range;
}