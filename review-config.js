export const reviewConfig = {
  githubLink: "",

  setGithubLink(newLink) {
    this.githubLink = newLink;
  },

  reviewRequest() {
    return `
              Bây giờ tôi sẽ gửi cho bạn link github, tôi muốn bạn review bài tập ở link github đó.
              Đây là link github của tôi: ${this.githubLink}.
              Kết quả review được trả lời bằng tiếng việt.
              Cấu trúc review sẽ gồm:
              1. Nhận xét chi tiết
              2. Đánh giá tổng quan
              3. Kết quả (chỉ trả lời pass/fail)
            `;
  },
};
