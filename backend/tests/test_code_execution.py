import pytest

from tests.conftest import auth_headers


@pytest.mark.asyncio
async def test_execute_python(client, student_token):
    response = await client.post(
        "/execute",
        json={"language": "python", "code": "print('hello')"},
        headers=auth_headers(student_token),
    )
    assert response.status_code == 200
    data = response.json()
    assert data["stdout"].strip() == "hello"
    assert data["exit_code"] == 0


@pytest.mark.asyncio
async def test_execute_javascript(client, student_token):
    response = await client.post(
        "/execute",
        json={"language": "javascript", "code": "console.log('hello')"},
        headers=auth_headers(student_token),
    )
    assert response.status_code == 200
    data = response.json()
    assert data["stdout"].strip() == "hello"
    assert data["exit_code"] == 0


@pytest.mark.asyncio
async def test_execute_python_with_stdin(client, student_token):
    response = await client.post(
        "/execute",
        json={"language": "python", "code": "name = input()\nprint(f'Hello {name}')", "stdin": "World"},
        headers=auth_headers(student_token),
    )
    assert response.status_code == 200
    assert "Hello World" in response.json()["stdout"]


@pytest.mark.asyncio
async def test_execute_python_runtime_error(client, student_token):
    response = await client.post(
        "/execute",
        json={"language": "python", "code": "raise ValueError('oops')"},
        headers=auth_headers(student_token),
    )
    assert response.status_code == 200
    data = response.json()
    assert data["exit_code"] != 0
    assert "ValueError" in data["stderr"]


@pytest.mark.asyncio
async def test_execute_unauthenticated(client):
    response = await client.post(
        "/execute",
        json={"language": "python", "code": "print('hi')"},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_execute_returns_language(client, teacher_token):
    response = await client.post(
        "/execute",
        json={"language": "python", "code": "print(1+1)"},
        headers=auth_headers(teacher_token),
    )
    assert response.status_code == 200
    assert response.json()["language"] == "python"
