
export class UtilsBaseExceptionLangValidator {

  static exceptionCustomer() {
    return `Id khách hàng, truyền -1 để lấy tất cả `;
  }

  static exceptionStringDate() {
    return `Thời gian lấy theo định dạng:
    \n . Các định dạng: lấy theo ngày: YYYY-mm-dd, 
    \n . Các định dạng: lấy theo tuần: YYYY-mm, 
    \n . Các định dạng: lấy theo tháng: YYYY-mm, 
    \n . Các định dạng: lấy theo năm: YYYY`;
  }

  static exceptionStringYear() {
    return `Năm muốn lấy, nếu không truyền sẽ lấy năm hiện tại.`;
  }

  static exceptionStringFromDate() {
    return `Thời gian bắt đầu, Nếu truyền rỗng('') là lấy hết, ngược lại sẽ lấy theo kết quả người dùng.
    \n . Các định dạng: lấy theo ngày: YYYY-mm-dd, 
    \n . Các định dạng: lấy theo tuần: YYYY-mm, 
    \n . Các định dạng: lấy theo tháng: YYYY-mm, 
    \n . Các định dạng: lấy theo năm: YYYY`;
  }

  static exceptionStringToDate() {
    return `Thời gian kết thúc, Nếu truyền rỗng('') là lấy hết, ngược lại sẽ lấy theo kết quả người dùng.
    \n . Các định dạng: lấy theo ngày: YYYY-mm-dd, 
    \n . Các định dạng: lấy theo tuần: YYYY-mm, 
    \n . Các định dạng: lấy theo tháng: YYYY-mm, 
    \n . Các định dạng: lấy theo năm: YYYY`;
  }

  static exceptionStringKeySearch() {
    return `Tiềm kiếm, Nếu truyền rỗng("") thì sẽ lấy hết ngược lại sẽ lấy theo giá trị người dùng truyền vào!`;
  }

  static exceptionStringLimit() {
    return `Giới hạn phần tử lấy lên, Mặc định sẽ lấy 20 phần tử nếu người dùng không truyền vào.`;
  }

  static exceptionStringPage() {
    return `Phân trang người dùng, mặc định sẽ lấy trang đầu tiên nếu người dùng không truyền vào.`;
  }
}
