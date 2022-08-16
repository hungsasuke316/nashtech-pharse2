const Paging = (props) => {
  const handleNext = () => {
    let temp = props.page + 1;
    if (temp <= props.numPage) {
      props.setPage(temp);
    }
  };

  const handlePre = () => {
    let temp = props.page - 1;
    if (temp >= 1) {
      props.setPage(temp);
    }
  };
  return (
    <div className="paging">
      {props.numPage > 1 ? (
        <div className="paging text-end">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handlePre}
            id="btnPre"
          >
            Previous
          </button>
          {Array.from({ length: props.numPage }, (_, i) => (
            <button
              type="button"
              onClick={() => props.setPage(i + 1)}
              id={`btn-paging_${i}`}
              className={
                props.page === i + 1
                  ? "btn btn-danger"
                  : "btn btn-outline-danger"
              }
            >
              {i + 1}
            </button>
          ))}
          <button
          id="btnNext"
            type="button"
            className="btn btn-outline-danger"
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Paging;
