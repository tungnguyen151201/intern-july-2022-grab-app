# GraphQL
## Mục lục
  1. [Schema](#schema)
  2. [Arguments](#arguments)
  3. [Types](#types)
  4. [Resolvers](#resolvers)
  5. [Flow](#flow)
## Schema
* Schema là tập hợp các kiểu object trong đó mỗi object chứa các field mang kiểu dữ liệu schalar hoặc kiểu object khác. Schema là một lớp trừu tượng giúp cho frontend và backend biết cần yêu cầu cũng như kéo về dữ liệu như thế nào.
## Arguments
* Argument là giá trị bạn cung cấp cho từng field trong query. Nó dùng để xác định làm thế nào để populate data cho field đó.
* Các resolvers có thể dùng arguments để kéo về những object riêng biệt, lọc data từ 1 set các object hay thậm chí là biến đổi giá trị trả về của field.
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
**Resolver** là một function chịu trách nghiệm populate data cho 1 field trong schema
* Nếu resolver không được định nghĩa thì Apollo Server sẽ tự định nghĩa **[default resolver](https://www.apollographql.com/docs/apollo-server/data/resolvers#default-resolvers)**
* **Resolving object, query or mutation:**

  ---
      Query: {
        field_name(parent, args, context, info) {  
          //return something;  
        }
      }

  ---
  * **parent:** giá trị trả về của resolver của field cha của nó
    
    ---

        query GetBooksByLibrary {  
          libraries {  
            books {  
              title  
              author {  
                name  
              }  
            }  
          }  
        }  

    ---
    Ví dụ: parent của author là books
  * **args:** object chứa tất các arguments của field này
  * **context:** được tạo ra khi client gửi 1 request đến server, dùng để truyền những thứ cho resolver cần như là authentication scope, database connections, custom fetch functions.
  * **info:** chứa thông tin trạng thái thực thi của operations (query, mutation) dưới dạng AST
* **Resolving a union or an interface:**

  ---

      Book: {
        __resolveType(obj, context, info){
          // Only Author has a name field
          if(obj.name){
            return 'Author';
          }
          // Only Book has a title field
          if(obj.title){
            return 'Book';
          }
          return null; // GraphQLError is thrown
        },
      }

  ---
# Flow
1. Client gửi request cho server
2. Gọi hàm khởi tạo context
3. Parse query thành AST
4. Kiểm tra AST có field nào không định nghĩa trong schema không. Nếu có thì báo lỗi, ngược lại gọi các hàm resolvers
5. Các resolver được gọi theo resolver chain:
  * Resolve các query chỉ có scalar, enum hay list các kiểu dữ liệu đó thì chỉ cần 1 resolver
  * Khi resolve object type: nó sẽ resolve các schalar, enum field trước, đến field là object type thì nó truyền tham số parent cho resolver tiếp theo và tiếp tục resolve cho đến khi hết field.
  
    >Lưu ý: resolver cha chỉ gọi resolver con khi query yêu cầu field con đó.