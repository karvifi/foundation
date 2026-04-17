---
name: swift-development
description: Swift/SwiftUI iOS and macOS development — structure, patterns, best practices
triggers: [swift, swiftui, ios, macos, apple, xcode, iphone, ipad]
---

# SKILL: Swift Development

## Purpose
Build production-quality Swift applications following Apple's modern patterns.

## SwiftUI Architecture (MVVM)
```swift
// View — only layout, no business logic
struct UserListView: View {
    @StateObject private var viewModel = UserListViewModel()
    
    var body: some View {
        List(viewModel.users) { user in
            UserRowView(user: user)
        }
        .task { await viewModel.loadUsers() }
    }
}

// ViewModel — business logic, state management
@MainActor
class UserListViewModel: ObservableObject {
    @Published var users: [User] = []
    @Published var isLoading = false
    @Published var error: Error?
    
    private let repository: UserRepository
    
    init(repository: UserRepository = UserRepositoryImpl()) {
        self.repository = repository
    }
    
    func loadUsers() async {
        isLoading = true
        defer { isLoading = false }
        do {
            users = try await repository.fetchUsers()
        } catch {
            self.error = error
        }
    }
}

// Model — plain data, Codable for API
struct User: Identifiable, Codable, Equatable {
    let id: UUID
    let name: String
    let email: String
}
```

## Networking Pattern
```swift
// Use URLSession with async/await
actor NetworkService {
    private let session: URLSession
    private let decoder = JSONDecoder()
    
    init(session: URLSession = .shared) {
        self.session = session
    }
    
    func fetch<T: Decodable>(_ type: T.Type, from url: URL) async throws -> T {
        let (data, response) = try await session.data(from: url)
        
        guard let httpResponse = response as? HTTPURLResponse,
              200...299 ~= httpResponse.statusCode else {
            throw NetworkError.invalidResponse
        }
        
        return try decoder.decode(T.self, from: data)
    }
}
```

## State Management Rules
```
@State — local UI state (transient, owned by view)
@StateObject — local ViewModel (owned by view, persists)
@ObservedObject — external ViewModel (passed in, not owned)
@EnvironmentObject — dependency injection (global objects)
@Binding — two-way binding (passed from parent)
```

## Error Handling Pattern
```swift
enum AppError: LocalizedError {
    case networkError(Error)
    case decodingError
    case notFound
    
    var errorDescription: String? {
        switch self {
        case .networkError(let error): return error.localizedDescription
        case .decodingError: return "Unable to process response"
        case .notFound: return "Content not found"
        }
    }
}
```

## Testing Pattern
```swift
@MainActor
final class UserListViewModelTests: XCTestCase {
    var sut: UserListViewModel!
    var mockRepository: MockUserRepository!
    
    override func setUp() {
        mockRepository = MockUserRepository()
        sut = UserListViewModel(repository: mockRepository)
    }
    
    func testLoadUsersSucceeds() async {
        mockRepository.users = [User.mock]
        await sut.loadUsers()
        XCTAssertEqual(sut.users.count, 1)
        XCTAssertFalse(sut.isLoading)
    }
}
```

## Quality checks
- [ ] Views contain only layout code
- [ ] ViewModels are @MainActor
- [ ] Network calls are async/await (no completion handlers)
- [ ] Errors surfaced to UI with user-friendly messages
- [ ] Unit tests for all ViewModel logic
- [ ] Accessibility identifiers set for UI testing
