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
### Lưu config trong environment
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
### Coi Backing services như là tài nguyên đính kèm (attached resources)
- Backing services là những thứ sử dụng thông qua mạng như là một thành phần trong vận hành. Ví dụ như là database, memcache, messaging/queueing systems, SMTP services...
- Trong 12-factor app không có sự phân biệt giữa local và third-party services. Chúng đều là attached resources, truy cập thông qua URL hoặc thông tin đăng nhập lưu trong config.
- 12-factor app có thể dễ dàng thay đổi các resources đó mà không cần thay đổi bất kì dòng code nào. Ví dụ có thể swap giữa local database sang cloud database, database cũ gặp trục trặc có thể thay thế bằng database khác mà không cần thay đổi code.
## V. Build, release, run
### Tách biệt hoàn toàn giữa build, realease và run
- 1 codebase chuyển đổi thành deploy thông qua 3 bước:
  - Build stage: compile code và dependency
  - Release stage: build với config cụ thể trong môi trường đó
  - Run stage (runtime): chạy app
- Ví dụ, không thể thay đổi code khi đã ở runtime vì không thể nào quay ngược lại build stage.
- Deployment tools thường đi kèm với management tools cho phép chuyển đổi về lại các release trước.
- Mỗi release nên có 1 unique ID (ví dụ như timestamp hoặc v1.0.1). Release không thể thay đổi kể từ khi nó được tạo ra. Mọi thay đổi đều phải đem vào release mới.
- Build được tạo ra bất cứ khi nào dev deploy code mới. Runtime có thể tự động xảy ra mỗi khi server reboot hay 1 crashed process restart. Do đó runtime nên giữ các thành phần thay đổi càng ít càng tốt, vì lỗi mà xảy ra nửa đêm thì không có dev nào hoạt động để sửa. Build stage có thể phức tạp hơn, vì các lỗi có thể xuất hiện trước mắt cho dev, người đang thực hiện deploy biết được.
## VI. Processes
### Vận hành ứng dụng như là một hoặc nhiều tiến trình phi trạng thái
- 12-factor processes là phi trạng thái và không chia sẻ bất cứ tài nguyên nào. Bất kỳ dữ liệu nào cần lưu trữ lâu dài cần được lưu trữ trong stateful backing services, thông thường là database.
- Giả sử trường hợp excute app với các process có trạng thái, khi 1 process phải restart bởi 1 lí do nào đó (thay đổi config, environment...) thì các trạng thái đó cũng bay màu theo.
## VII. Port binding
### Export services via port binding
- 12-factor app không cần phải tích hợp webserver. Web app cung cấp service thông qua việc mở cổng mạng và lắng nghe các request được gửi tới.
- Việc này được triển khai bằng cách định nghĩa dependency để thêm 1 webserver library vào app. Ràng buộc đối với môi trường thực thi là việc mở cổng để lắng nghe các request.
- Việc mở cổng cũng có nghĩa rằng 1 app có thể trở thành backing service cho app khác.
## VIII. Concurrency
### Mở rộng theo chiều ngang thông qua mô hình tiến trình
- Bất kỳ chương trình máy tình nào, khi vận hành, đều được đại diện bởi một hoặc nhiều tiến trình vận hành.
- Trong 12-factor app, các tiến trình thành phần là nền tảng đầu tiên. Các tiến trình này sử dụng các tín hiệu rõ rệt từ các mô hình tiến trình của unix cho các dịch vụ chạy nền. Với mô hình này, dev thiết kế app để điều khiển các công việc khác nhau bằng cách gán mỗi loại công việc ứng với mỗi loại process (process type). Ví dụ, HTTP request có thể được điều khiển bởi web process, các công việc chạy ngầm tốn thời gian có thể xử lý bằng các worker process.
## IX. Disposability
### Tối ưu hoá với khởi động nhanh và dừng phần mềm ổn định
- Các tiến trình nên cố gắng giảm thiểu thời gian khởi động. Lý tưởng nhất, một tiến trình chỉ cần một vài giây kể từ khi có lệnh khởi động cho đến khi tiến trình bắt đầu và sẵn sàng để nhận yêu cầu hay bắt đầu công việc. Thời gian khởi động ngắn cho phép quá trình triển khai và mở rộng nhanh hơn; và hỗ trợ mạnh mẽ hơn, vì process manager có thể dễ dàng mang các tiến trình tới các máy chủ vật lý.
- Đối với web process, graceful shutdown là ngừng lắng nghe trên service port (từ chối tất cả request mới), cho phép các request hiện tại được hoàn thành và thoát ra. Ý tưởng của mô hình này là các HTTP requests cần thực hiện trong thời gian ngắn, hoặc trong trường hợp kết nối lâu hơn, ứng dụng cần thực hiện kết nối lại khi các kết nối đã bị mất.
- Đối với worker process, graceful shutdown là đưa các công việc trở lại hàng đợi khi mà tiến trình thực thi mất kết nối. Khi mà kết nối trở lại thì có thể tiếp tục các công việc đó.
## X. Dev/prod parity
### Đảm bảo sự tương đồng giữa môi trường phát triển, kiểm thử và thực tế
- 12-factor app được thiết kế để triển khai liên tục bằng việc giảm thiểu sự khác biệt giữa quá trình triển khai và vận hành thực tế:
  - Giảm thiểu thời gian: dev có thể viết code và triển khai sau đó vài giờ, thậm chí vài phút.
  - Giảm thiểu tính cá nhân: dev - người viết ra các dòng code, có thể tham gia trực tiếp vào quá trình triển khai và quan sát các hành vi của ứng dụng trong môi trường vận hành thực tế.
  - Giảm thiểu các công cụ: đảm bảo sự tương đồng giữa môi trường phát triển và vận hành.
- 12-factor app không cho phép sử dụng backing services khác nhau giữa môi trường phát triển và vận hành. Sự khác biệt này gây ra việc code hoạt động tốt ở môi trường test nhưng lại không hoạt động ở môi trường thực tế.
## XI. Logs
### Coi logs là event streams
- Logs cung cấp khả năng thể hiện các hành vi của app đang vận hành. Trong môi trường server chúng thường được ghi lại thành các tệp tin trên ổ đĩa cứng (logfile), nhưng chỉ có một định dạng biểu diễn duy nhất.
- 12-factor app không bao giờ quan tâm đến việc điều hướng hay lưu trữ output stream. App không cần ghi hoặc quản lý các logfiles. Thay vào đó, mỗi tiến trình đang vận hành sẽ ghi các event stream.
- Event stream của app có thể ghi ra các tệp tin, hoặc xem trực tiếp trên terminal. Hơn nữa, stream còn có thể được đánh index và phân tích bởi hệ thống như là Splunk hay Hadoop/Hive. Các hệ thống này cung cấp các công cụ mạnh mẽ và linh hoạt cho việc phân tích hành vi của app theo thời gian.
## XII. Admin processes
### Thực thi nhiệm vụ quản trị như là một tiến trình
- Các nhiệm vụ quản trị app như là:
  - Thay đổi database.
  - Giao diện điều khiển trực tiếp app, chạy các đoạn code tùy ý hoặc kiểm tra các mô hình của app đối với database hiện tại.
  - Chạy các one-time scripts.
- Tiến trình quản trị thực thi một lần (one-off admin process) nên được vận hành trong một môi trường giống với môi trường vận hành lâu dài (long-running) của app. Với 1 bản release, admin process sử dụng cùng 1 codebase và config với process vận hành bản release đó.