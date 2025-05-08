const pagination = (totalItems, itemsPerPage, currentPage) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Check if the currentPage is out of range
    if (currentPage < 1 || currentPage > totalPages) {
        return {
            statusCode: 404,
            status: "Failed",
            message: "Page number out of range. Please enter a valid page number.",
            data: [],
            pagination: {}
        };
    }

   
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;
    const previousPage = currentPage > 1 ? currentPage - 1 : null;

    return {
        currentPage: currentPage,
        totalPages: totalPages,
        nextPage: nextPage,
        previousPage: previousPage,
        totalItems: totalItems
    };
};

module.exports = pagination;