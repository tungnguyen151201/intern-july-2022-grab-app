# 12 factors
## Mục lục
  1. [Codebase](#i-codebase)
  2. [Dependencies](#ii-dependencies)
  3. [Config](#iii-config)
  4. [Backing services](#iv-backing-services)
  5. [Build, release, run](#v-build-release-run)
  6. [Processes](#vi-processes)
  7. [Port binding](#vii-port-binding)
  8. [Concurrency](#viii-concurrency)
  9. [Disposability](#ix-disposability)
  10. [Dev/prod parity](#x-devprod-parity)
  11. [Logs](#xi-logs)
  12. [Admin processes](#xii-admin-processes)
## I. Codebase
### Codebase được theo dõi với hệ thống quản lý phiên bản, và nhiều lần triển khai
- Một 12-factor app luôn luôn được theo dõi bởi hệ thống quản lý phiên bản (ví dụ như Git). Tất cả phiên bản của code được lưu trong 1 repo (code repository). Một codebase là nhóm các repo có cùng root commit.
- Nhiều app dùng chung 1 code là vi phạm luật 12-factor, thay vào đó thì nên bỏ vào các thư viện và dùng dependency manager để quản lý.
- Mỗi app chỉ có 1 codebase và có nhiều triển khai.
- 1 triển khai là 1 đối tượng thực thi của app đó. Ví dụ như bản chính thức của app, bản thử nghiệm hay bản của mỗi dev test trên local...
## II. Dependencies
### Khai báo rõ ràng và phân tách các dependency
- Một 12-factor app không bao giờ phụ thuộc vào sự tồn tại tuyệt đối của các gói hệ thống. Chỉ cần khai báo trong 1 dependency declaration manifest nào đó (ví dụ nodejs thì là package.json). 1 người mới tham gia dự án có thể dễ dàng check out codebase và sau đó cài đặt các dependency dễ dàng.
## III. Config
### Lưu config trong env var
- Config là những thứ thay đổi khi thay đổi deploy. Bao gồm:
    - Tài nguyên xử lý database, memcached và các [backing services](#iv-backing-services) khác.
    - Thông tin đăng nhập cho các dịch vụ như là Amazon S3, Twitter, Google Maps...
    - Các giá trị ứng với từng triển khai như là hostname để triển khai
- Config phải tách rời với code (config thay đổi còn code thì không).
- Các cách tiếp cận với config:
  - Config files: nhược điểm là có thể push nhầm lên repo => khắc phục bằng cách rải rác config files nhiều nơi và nhiều định dạng, làm cho nó khó quản lý tất cả config ở 1 nơi.
  - Environment variables: dễ dàng thay đổi giữa các deploy và ít bị push nhầm lên repo hơn config files.
  - Nhóm các config theo môi trường. Ví dụ như development, test, production... Tuy nhiên nếu app càng ngày càng lớn, nhiều người deploy hơn thì sinh ra nhiều config hơn dẫn đến khó quản lý.
## IV. Backing services
### Coi Backing services như là tài nguyên đính kèm
- Backing services là những thứ sử dụng thông qua mạng như là một thành phần trong vận hành. Ví dụ như là database, memcache, messaging/queueing systems, SMTP serivices...
- Trong 12-factor app không có sự phân biệt giữa local và third-party services. Chúng đều là tài nguyên đính kèm, truy cập thông qua URL hoặc thông tin đăng nhập lưu trong config.
## V. Build, release, run
## VI. Processes
## VII. Port binding
## VIII. Concurrency
## IX. Disposability
## X. Dev/prod parity
## XI. Logs
## XII. Admin processes