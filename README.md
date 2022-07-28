# GraphQL
## Mục lục
  1. [Types](#types)
  2. [Resolvers](#resolvers)
## Types
* **Schalar types:** Int, Float, String, Boolean, ID
* **Object types:**  một object sẽ bao gồm nhiều field, mỗi field sẽ có kiểu dữ liệu riêng
* **Query type:** là một kiểu object đặc biệt định nghĩa entry points cho các read operations
* **Mutation type:** là một kiểu object đặc biệt định nghĩa entry points cho các write operations
* **Input object types:**
  * Mỗi field của 1 input object type chỉ có thể là scalar, enum, hoặc input object type khác
  * Giống kiểu object nhưng có thể dùng nó như các arguments của các field trong các kiểu object thông thường khác
* **Enum types:** kiểu enum dùng để biểu diễn 1 list các giá trị có thể định nghĩa cho field đó.
  * Mặc dù có thể sủ dụng kiểu String để biểu diễn cho locationType ("spaceship" hoặc "house"...) nhưng nếu người dùng nhập cái gì đó không hợp lệ ("space ship", "bla bla"...) thì sẽ gây ra những unnecessary complications (ví dụ như thiếu dữ liệu, dữ liệu sai...) khi mình filter hay tổ chức dữ liệu
  * Để giữ cho data clean và consistent, ta nên sử dụng enum giới hạn locationType về 1 set các giá trị nhỏ hơn
* **Union type:** định nghĩa những object types nào sẽ nằm trong union
  * Ví dụ:
    ---

        union Media = Book | Movie

    ---
  * Tất cả kiểu dữ liệu trong union phải là object type
* **Interface:** xác định các field cho nhiều object types
  * Nếu 1 object type implements interface thì nó phải bao gồm tất cả các field mà interface có
  * 1 field có thể có kiểu dữ liệu là 1 interface. Nó có thể trả về bất cứ object type nào mà implements interface đó
### Có 2 nhóm types:
* **Input types:** Schalar, Enum, Input object types
* **Output types:** Scalar, Object, Interface, Union, Enum
## Resolvers
