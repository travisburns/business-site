using AutoMapper;
using AutoMapper.QueryableExtensions;
using Pipeline.DTOs.Common;

namespace Pipeline.Extensions
{
    public static class QueryableExtensions
    {
        public static PagedResultDto<TDto> ToPagedResult<TEntity, TDto>(
            this IQueryable<TEntity> query,
            IMapper mapper,
            int pageNumber,
            int pageSize)
        {
            var totalCount = query.Count();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
            var items = query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ProjectTo<TDto>(mapper.ConfigurationProvider)
                .ToList();

            return new PagedResultDto<TDto>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalPages = totalPages
            };
        }
    }
}
